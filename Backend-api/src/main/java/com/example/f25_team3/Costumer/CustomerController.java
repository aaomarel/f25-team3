package com.csc340.team3.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin("*")
public class CustomerController {

    @Autowired
    private CustomerService service;

    @GetMapping
    public List<Customer> getAllCustomers() { return service.getAll(); }

    @GetMapping("/{id}")
    public Customer getCustomer(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) { return service.create(customer); }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        return service.update(id, customer);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) { service.delete(id); }