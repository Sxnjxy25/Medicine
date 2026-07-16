package com.medistock.controller;

import com.medistock.entity.Medicine;
import com.medistock.service.MedicineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    // Get all medicines
    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    // Get medicine by ID
    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Integer id) {

        Optional<Medicine> medicine = medicineService.getMedicineById(id);

        return medicine.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Add a new medicine
    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return medicineService.saveMedicine(medicine);
    }

    // Update medicine
    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Integer id,
                                                   @RequestBody Medicine medicine) {

        Optional<Medicine> existing = medicineService.getMedicineById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        medicine.setId(id);

        return ResponseEntity.ok(
                medicineService.saveMedicine(medicine)
        );
    }

    // Delete medicine
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Integer id) {

        medicineService.deleteMedicine(id);

        return ResponseEntity.noContent().build();
    }
}