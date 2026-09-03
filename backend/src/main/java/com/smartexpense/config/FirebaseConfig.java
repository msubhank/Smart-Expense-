package com.smartexpense.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.InputStream;

/**
 * Initializes the Firebase Admin SDK using the configured service account key.
 */
@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.config.path:classpath:serviceAccountKey.json}")
    private String configPath;

    @Value("${firebase.project-id:smart-expense-app}")
    private String projectId;

    private final ResourceLoader resourceLoader;

    public FirebaseConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void initializeFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) {
            log.info("FirebaseApp is already initialized.");
            return;
        }

        try {
            Resource resource = resourceLoader.getResource(configPath);
            if (resource.exists()) {
                try (InputStream serviceAccount = resource.getInputStream()) {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .setProjectId(projectId)
                            .build();

                    FirebaseApp.initializeApp(options);
                    log.info(">>> Firebase Admin SDK initialized successfully for project: {}", projectId);
                    return;
                }
            } else {
                log.warn("=========================================================================================");
                log.warn("NOTICE: Firebase serviceAccountKey.json was not found at: {}", configPath);
                log.warn("Public endpoints (/api/health) are operational.");
                log.warn("Whenever ready, save your private key to: src/main/resources/serviceAccountKey.json");
                log.warn("=========================================================================================");
            }
        } catch (Exception e) {
            log.error("Failed to initialize Firebase Admin SDK: {}", e.getMessage(), e);
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth() {
        if (FirebaseApp.getApps().isEmpty()) {
            return null;
        }
        return FirebaseAuth.getInstance();
    }

    @Bean
    public Firestore firestore() {
        if (FirebaseApp.getApps().isEmpty()) {
            return null;
        }
        return FirestoreClient.getFirestore();
    }
}
