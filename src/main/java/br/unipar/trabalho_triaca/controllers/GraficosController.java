package br.unipar.trabalho_triaca.controllers;

import br.unipar.trabalho_triaca.models.*;
import br.unipar.trabalho_triaca.services.RelatorioService;
import br.unipar.trabalho_triaca.services.SwitchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GraficosController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping("/api/relatorios/countByMarca")
    public List<MarcaCount> countSwitchesByMarca() {
        return relatorioService.countSwitchesByMarca();
    }

    @GetMapping("/api/relatorios/count")
    public List<InativoCount> countSwitches() {
        return relatorioService.countSwitches();
    }

    @GetMapping("/api/relatorios/countByModelo")
    public List<ModeloCount> countSwitchesByModelo() {
        return relatorioService.countSwitchesByModelo();
    }

    @GetMapping("/api/relatorios/countByVersao")
    public List<VersaoCount> countSwitchesByVersao() {
        return relatorioService.countSwitchesByVersao();
    }
}
