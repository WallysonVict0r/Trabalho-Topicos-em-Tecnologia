package br.unipar.trabalho_triaca;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "table_inv_switches")
public class Switch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long registro;

    @Column(name = "data", nullable = false)
    private Date data;

    @Column(name = "hora", nullable = false, length = 9)
    private String hora;

    @Column(name = "hostname", nullable = false, length = 30)
    private String hostname;

    @Column(name = "ip_address", nullable = false, length = 16)
    private String ipAddress;

    @Column(name = "mac_address", nullable = false, length = 18)
    private String macAddress;

    @Column(name = "marca", nullable = false, length = 20)
    private String marca;

    @Column(name = "modelo", nullable = false, length = 20)
    private String modelo;

    @Column(name = "num_serie", nullable = false, length = 20)
    private String numSerie;

    @Column(name = "versao", nullable = false, length = 20)
    private String versao;

    @Column(name = "imobilizado", nullable = false, length = 10)
    private String imobilizado;

    public Long getRegistro() {
        return registro;
    }

    public void setRegistro(Long registro) {
        this.registro = registro;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getMacAddress() {
        return macAddress;
    }

    public void setMacAddress(String macAddress) {
        this.macAddress = macAddress;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getNumSerie() {
        return numSerie;
    }

    public void setNumSerie(String numSerie) {
        this.numSerie = numSerie;
    }

    public String getVersao() {
        return versao;
    }

    public void setVersao(String versao) {
        this.versao = versao;
    }

    public String getImobilizado() {
        return imobilizado;
    }

    public void setImobilizado(String imobilizado) {
        this.imobilizado = imobilizado;
    }
}

