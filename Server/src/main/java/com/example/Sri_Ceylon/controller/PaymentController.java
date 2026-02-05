package com.example.Sri_Ceylon.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Value("${payhere.merchant.id:1233905}")
    private String merchantId;

    @Value("${payhere.merchant.secret:YOUR_MERCHANT_SECRET_HERE}")
    private String merchantSecret;

    /**
     * Generate PayHere payment hash
     * Hash = MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase()).toUpperCase()
     */
    @PostMapping("/generate-hash")
    public ResponseEntity<Map<String, String>> generatePaymentHash(@RequestBody Map<String, String> request) {
        try {
            System.out.println("Payment hash request received: " + request);
            
            String orderId = request.get("orderId");
            String amount = request.get("amount");
            String currency = request.getOrDefault("currency", "LKR");
            
            System.out.println("Order ID: " + orderId + ", Amount: " + amount + ", Currency: " + currency);

            if (orderId == null || amount == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "orderId and amount are required");
                return ResponseEntity.badRequest().body(error);
            }

            // Step 1: Hash the merchant secret
            String hashedSecret = md5(merchantSecret).toUpperCase();

            // Step 2: Create the hash string
            String hashString = merchantId + orderId + amount + currency + hashedSecret;

            // Step 3: Hash the final string
            String hash = md5(hashString).toUpperCase();

            Map<String, String> response = new HashMap<>();
            response.put("hash", hash);
            response.put("merchantId", merchantId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to generate hash: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Verify PayHere payment notification
     */
    @PostMapping("/notify")
    public ResponseEntity<String> handlePaymentNotification(@RequestParam Map<String, String> params) {
        try {
            String merchantIdReceived = params.get("merchant_id");
            String orderId = params.get("order_id");
            String amount = params.get("payhere_amount");
            String currency = params.get("payhere_currency");
            String statusCode = params.get("status_code");
            String md5sig = params.get("md5sig");
            String hotelId = params.get("custom_1");

            // Verify signature
            String hashedSecret = md5(merchantSecret).toUpperCase();
            String verifyString = merchantIdReceived + orderId + amount + currency + statusCode + hashedSecret;
            String localMd5sig = md5(verifyString).toUpperCase();

            if (localMd5sig.equals(md5sig) && "2".equals(statusCode)) {
                // Payment successful
                // TODO: Update hotel isPaid status in database
                System.out.println("Payment successful for hotel: " + hotelId);
                System.out.println("Order ID: " + orderId);
                System.out.println("Amount: " + amount + " " + currency);

                // Here you would update the hotel's payment status
                // hotelService.updatePaymentStatus(hotelId, true);

                return ResponseEntity.ok("SUCCESS");
            } else {
                System.out.println("Payment verification failed or payment not successful");
                return ResponseEntity.ok("FAILED");
            }
        } catch (Exception e) {
            System.err.println("Error processing payment notification: " + e.getMessage());
            return ResponseEntity.badRequest().body("ERROR");
        }
    }

    /**
     * MD5 hash utility method
     */
    private String md5(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] hashBytes = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : hashBytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
