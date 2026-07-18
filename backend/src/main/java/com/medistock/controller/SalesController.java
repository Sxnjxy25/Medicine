package com.medistock.controller;

import com.medistock.entity.Sale;
import com.medistock.entity.SaleItem;
import com.medistock.repository.SaleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SalesController {

    private final SaleRepository saleRepository;

    public SalesController(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    @GetMapping
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Sale> createSale(@RequestBody Sale sale) {
        if (sale.getSaleDate() == null) {
            sale.setSaleDate(LocalDateTime.now());
        }
        
        // Link all items to the sale parent entity
        if (sale.getItems() != null) {
            for (SaleItem item : sale.getItems()) {
                item.setSale(sale);
            }
        }
        
        Sale savedSale = saleRepository.save(sale);
        return ResponseEntity.ok(savedSale);
    }
}
