package com.hms.inventory.repository;

import com.hms.inventory.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {
    Optional<InventoryItem> findByItemName(String itemName);
}