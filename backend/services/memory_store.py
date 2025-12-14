from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from google.adk.tools import load_memory, preload_memory
#from agents.job_finder_agent import get_profile_report, rank_jobs, generate_queries, search_jobs
from google.genai import types

async def auto_save_to_memory(callback_context):
    await callback_context._invocation_context.memory_service.add_session_to_memory(
        callback_context._invocation_context.session
    )

async def run_session(
    runner_instance: Runner, user_queries: list[str] | str, session_id: str = "default"
):
    print(f"\n### Session: {session_id}")
    session_service = runner_instance.session_service
    APP_NAME = runner_instance.app_name
    USER_ID = "demo_user"

    try:
        session = await session_service.create_session(
            app_name=APP_NAME, user_id=USER_ID, session_id=session_id
        )
    except:
        session = await session_service.get_session(
            app_name=APP_NAME, user_id=USER_ID, session_id=session_id
        )


    if isinstance(user_queries, str):
        user_queries = [user_queries]
    final_response= None
    for query in user_queries:
        print(f"\nUser > {query}")
        query_content = types.Content(role="user", parts=[types.Part(text=query)])


        async for event in runner_instance.run_async(
            user_id=USER_ID, session_id=session.id, new_message=query_content
        ):
            print("\n--- EVENT ---")
            print(event)


            function_calls = event.get_function_calls()
            if function_calls:
                for fc in function_calls:
                    print(" Tool call:", fc.name)
                    print("Args:", fc.args)

                    try:
                        if fc.name == "get_profile_report":
                            result = get_profile_report(**fc.args)

                        elif fc.name == "generate_queries":
                            result = generate_queries(**fc.args)

                        elif fc.name == "search_jobs":
                            result = search_jobs(**fc.args)

                        elif fc.name == "rank_jobs":
                            result = rank_jobs(**fc.args)

                        else:
                            result = None


                        await session.send_tool_response(
                            tool_call_id=fc.id,
                            content=result
                        )

                        print(" Tool response sent")

                    except Exception as e:
                        print(" Tool execution failed:", e)
                        await session.send_tool_response(
                            tool_call_id=fc.id,
                            content={"error": str(e)}
                        )

            if event.is_final_response() and event.content:
                for part in event.content.parts:
                    if hasattr(part, "text") and part.text:
                        final_text = part.text
                        print("\n FINAL MODEL OUTPUT:")
                        print(final_text)

        if final_text is None:
            print(" Model never produced a final text response")
            return None

        return final_text