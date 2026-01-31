
try:
    with open('server7.log', 'r', encoding='utf-16') as f, open('error_log.txt', 'w', encoding='utf-8') as out:
         out.write(f.read())
except Exception as e:
    print(f"UTF-16 failed: {e}")
    print(f"UTF-16 failed: {e}")
    print(f"UTF-16 failed: {e}")
    print(f"UTF-16 failed: {e}")
    try:
        with open('server.log', 'r', encoding='utf-8') as f:
            print(f.read())
    except Exception as e2:
        print(f"UTF-8 failed: {e2}")
