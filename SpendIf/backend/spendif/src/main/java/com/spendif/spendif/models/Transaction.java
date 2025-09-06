package com.spendif.spendif.models;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;
    private String merchant;
    private String country;

    private boolean flagged = false;
    private String flagReason;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public boolean isFlagged() { return flagged; }
    public void setFlagged(boolean flagged) { this.flagged = flagged; }

    public String getFlagReason() { return flagReason; }
    public void setFlagReason(String flagReason) { this.flagReason = flagReason; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
