package com.spendif.spendif.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromEmail = "noreply@spendif.com";

    // ✅ Use environment variable so it works locally & on Railway
    @Value("${APP_BASE_URL:https://spendif.up.railway.app}")
    private String appBaseUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String token) {
        String subject = "Verify your Spendif account";
        String verificationLink = appBaseUrl + "/api/auth/verify?token=" + token;

        String body = "Welcome to Spendif!\n\n" +
                      "Please verify your account by clicking the link below:\n" +
                      verificationLink + "\n\n" +
                      "If you didn’t sign up, you can ignore this email.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
