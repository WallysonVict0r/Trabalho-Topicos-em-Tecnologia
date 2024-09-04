package br.unipar.trabalho_triaca;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SwitchRepository extends JpaRepository<Switch, Long> {
}
