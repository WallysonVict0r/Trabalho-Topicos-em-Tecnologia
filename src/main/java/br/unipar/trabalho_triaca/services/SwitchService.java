package br.unipar.trabalho_triaca.services;

import br.unipar.trabalho_triaca.models.*;
import br.unipar.trabalho_triaca.repositories.SwitchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SwitchService {

    @Autowired
    private SwitchRepository switchRepository;


    public Page<Switch> findAll(Pageable pageable) {
        return switchRepository.findAll(pageable);
    }
    public Page<Switch> getSwitches(Pageable pageable) {
        return switchRepository.findAll(pageable);
    }
}
