package br.unipar.trabalho_triaca.services;

import br.unipar.trabalho_triaca.models.*;
import br.unipar.trabalho_triaca.repositories.SwitchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RelatorioService {

    @Autowired
    private SwitchRepository switchRepository;

    public List<MarcaCount> countSwitchesByMarca() {
        return switchRepository.countSwitchesByMarca();
    }

    public List<InativoCount> countSwitches() {
        return switchRepository.countSwitchesInativos();
    }

    public List<ModeloCount> countSwitchesByModelo() {
        return switchRepository.countSwitchesByModelo();
    }

    public List<VersaoCount> countSwitchesByVersao() {
        return switchRepository.countSwitchesByVersao();
    }

}
