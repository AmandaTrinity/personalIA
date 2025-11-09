import smtplib

def enviar_email(email_usr: str, token: str):
    servico = smtplib.SMTP('smtp.gmail.com', 587)
    servico.starttls()
    servico.login('personalia.sender@gmail.com', 'ewhhyeaesoecrmhm ')
    envio = 'personalia.sender@gmail.com'
    servico.sendmail(envio, email_usr, token)
    servico.quit()