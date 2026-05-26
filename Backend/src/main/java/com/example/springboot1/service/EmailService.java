package com.example.springboot1.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }public void sendVerificationEmail(String to, String token) {

        String verificationLink =
                "http://localhost:3000/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Verify Your Email");
        message.setText(
                "Click the link below to verify your account:\n"
                        + verificationLink
        );

        mailSender.send(message);
    }


}
