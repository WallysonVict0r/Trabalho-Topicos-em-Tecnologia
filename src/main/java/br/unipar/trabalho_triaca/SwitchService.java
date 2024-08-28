package br.unipar.trabalho_triaca;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SwitchService {

    @Autowired
    private SwitchRepository switchRepository;

    public Page<Switch> getSwitches(Pageable pageable) {
        return switchRepository.findAll(pageable);
    }
}
