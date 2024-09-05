package br.unipar.trabalho_triaca.controllers;

import br.unipar.trabalho_triaca.services.SwitchService;
import br.unipar.trabalho_triaca.models.Switch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SwitchController {

    @Autowired
    private SwitchService switchService;

    @GetMapping("/api/switches")
    public Page<Switch> getSwitches(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return switchService.getSwitches(PageRequest.of(page, size));

    }

   




}
