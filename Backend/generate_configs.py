import os

messenger_yaml = """framework:
    messenger:
        failure_transport: failed

        transports:
            async: 
                dsn: '%env(MESSENGER_TRANSPORT_DSN)%'
                retry_strategy:
                    max_retries: 3
                    delay: 2000
                    multiplier: 2
            failed: 'doctrine://default?queue_name=failed'
            sync: 'sync://'

        routing:
            Symfony\Component\Mailer\Messenger\SendEmailMessage: async

when@test:
    framework:
        messenger:
            transports:
                async: 'in-memory://'
"""

webhook_yaml = """framework:
    webhook:
        routing:
            mailer_resend:
                service: mailer.webhook.request_parser.resend
                secret: '%env(MAILER_RESEND_SECRET)%'
"""

backend_path = r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend'
with open(os.path.join(backend_path, 'config', 'packages', 'messenger.yaml'), 'w') as f:
    f.write(messenger_yaml)

with open(os.path.join(backend_path, 'config', 'packages', 'webhook.yaml'), 'w') as f:
    f.write(webhook_yaml)
