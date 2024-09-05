package br.unipar.trabalho_triaca.repositories;

import br.unipar.trabalho_triaca.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SwitchRepository extends JpaRepository<Switch, Long> {

    @Query("SELECT s.marca AS marca, COUNT(s) AS qtd FROM Switch s GROUP BY s.marca ORDER BY qtd DESC")
    List<MarcaCount> countSwitchesByMarca();

    @Query(value = "SELECT COUNT(s.registro) as qtd_inativo, (SELECT COUNT(*) FROM Switch WHERE imobilizado = '') as qtd_ativo FROM Switch s GROUP BY qtd_ativo")
    List<InativoCount> countSwitchesInativos();

    @Query("SELECT s.modelo AS modelo, COUNT(s) AS qtd FROM Switch s GROUP BY s.modelo ORDER BY qtd DESC")
    List<ModeloCount> countSwitchesByModelo();

    @Query("SELECT s.versao AS versao, COUNT(s) AS qtd FROM Switch s GROUP BY s.versao ORDER BY qtd DESC")
    List<VersaoCount> countSwitchesByVersao();
}
