import os
import re

env_vars = """
###> symfony/mailer ###
MAILER_DSN=resend+api://CHANGE_ME@default
MAILER_RESEND_SECRET=CHANGE_ME
###< symfony/mailer ###

###> symfony/messenger ###
MESSENGER_TRANSPORT_DSN=doctrine://default?queue_name=email
###< symfony/messenger ###
"""

for env_file in ['.env', '.env.local']:
    filepath = os.path.join(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend', env_file)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if MAILER_DSN exists
        if 'MAILER_DSN=' in content:
            content = re.sub(r'^MAILER_DSN=.*$', 'MAILER_DSN=resend+api://CHANGE_ME@default', content, flags=re.MULTILINE)
        else:
            content += f"\nMAILER_DSN=resend+api://CHANGE_ME@default\n"
            
        if 'MAILER_RESEND_SECRET=' not in content:
            content += f"MAILER_RESEND_SECRET=CHANGE_ME\n"
            
        if 'MESSENGER_TRANSPORT_DSN=' in content:
            content = re.sub(r'^MESSENGER_TRANSPORT_DSN=.*$', 'MESSENGER_TRANSPORT_DSN=doctrine://default?queue_name=email', content, flags=re.MULTILINE)
        else:
            content += f"MESSENGER_TRANSPORT_DSN=doctrine://default?queue_name=email\n"
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {env_file}")
