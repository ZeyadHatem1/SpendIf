package com.spendif.spendif.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true) 
    private String username;

    @Column(nullable = false, unique = true) 
    private String email; // new field

    @Column(nullable = false)
    private String password;

    @Column
    private boolean verified = false; // new field

    // Fraud detection fields
    @Column
    private String homeCountry;

    @Column
    private double averageTransactionAmount;

    @Column
    private boolean dormant;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;

    // Constructors
    public User() {}
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getters & Setters
    public Long getId() { return id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getHomeCountry() { return homeCountry; }
    public void setHomeCountry(String homeCountry) { this.homeCountry = homeCountry; }

    public double getAverageTransactionAmount() { return averageTransactionAmount; }
    public void setAverageTransactionAmount(double averageTransactionAmount) { this.averageTransactionAmount = averageTransactionAmount; }

    public boolean isDormant() { return dormant; }
    public void setDormant(boolean dormant) { this.dormant = dormant; }

    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
    public void setId(Long userId) {
    }
}
