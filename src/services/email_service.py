import smtplib
from config.settings import settings

def send_email(email_usr: str, token: str):
    servico = smtplib.SMTP('smtp.gmail.com', 587)
    servico.starttls()
    email = settings.EMAIL
    senha_smtp = settings.SENHA_SMTP
    servico.login(email, senha_smtp)
    servico.sendmail(email, email_usr, token)
    servico.quit()