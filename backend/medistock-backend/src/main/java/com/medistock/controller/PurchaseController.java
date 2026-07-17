package com.medistock.controller;

import com.medistock.entity.Purchase;
import com.medistock.repository.PurchaseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "*")
public class PurchaseController {

    private final PurchaseRepository purchaseRepository;

    public PurchaseController(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    @GetMapping
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    @PostMapping
    public Purchase createPurchase(@RequestBody Purchase purchase) {
        return purchaseRepository.save(purchase);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Purchase> updatePurchase(@PathVariable Integer id, @RequestBody Purchase purchaseDetails) {
        Optional<Purchase> optionalPurchase = purchaseRepository.findById(id);
        if (optionalPurchase.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Purchase purchase = optionalPurchase.get();
        purchase.setInvoiceNumber(purchaseDetails.getInvoiceNumber());
        purchase.setSupplier(purchaseDetails.getSupplier());
        purchase.setDate(purchaseDetails.getDate());
        purchase.setItems(purchaseDetails.getItems());
        purchase.setTotal(purchaseDetails.getTotal());
        purchase.setStatus(purchaseDetails.getStatus());

        Purchase updatedPurchase = purchaseRepository.save(purchase);
        return ResponseEntity.ok(updatedPurchase);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePurchase(@PathVariable Integer id) {
        Optional<Purchase> optionalPurchase = purchaseRepository.findById(id);
        if (optionalPurchase.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        purchaseRepository.delete(optionalPurchase.get());
        return ResponseEntity.ok().build();
    }
}
