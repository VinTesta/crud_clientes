$(document).ready(() =>
{
    //#region DISPARA FUNÇÕES DE INICIALIZAÇÃO
    verificaAlerta();
    adicionaMascaras();
    //#endregion

    //#region MASKS
    function adicionaMascaras()
    {
        $('.cpf').mask('000.000.000-00', {placeholder: "___.___.___-__"});
        $('.data').mask('00/00/0000', {placeholder: "__/__/____"});
        $('.rg').mask('00.000.000-0', {placeholder: "__.___.___-_"});
        $('.celular').mask('(00)00000-0000', {placeholder: "(__)_____-____"});
        $('.cep').mask('00000-000', {placeholder: "_____-___"});
        $('.numEnd').mask('00000', {placeholder: "_____"});
        $('.uf').mask('AA', {placeholder: "_____"});
        $('.datepicker').datepicker({
            format: 'dd/mm/yyyy'
        });
    }
    //#endregion

    //#region id = btnLogar
    $(document).on("click", "#btnLogar", (e) => 
    {
        if(validaCampos(".validate-form"))
        {
            mostraMensagem("Campos inválidos! Preencha-os para continuar");
        }
        else
        {
            var campos = {email: $("#email").val(), senha: $("#senha").val()};
            
            login(campos)
        }
    })
    //#endregion

    //#region VALIDA CAMPOS
    function validaCampos(property)
    {
        var campos = $(property);
        var erro = false;
        for(var i=0; i < campos.length; i++)
        {
            if(campos[i].value == "")
            {
                campos[i].classList.add("invalidValue")
                erro = true;
            }
            else
            {
                campos[i].classList.remove("invalidValue")
            }
        }
        return erro;
    }
    //#endregion

    //#region LOGIN
    function login(campos)
    {
        $.ajax({
            url: "controller/logar-usuario.php",
            type: "POST",
            data: {email: campos['email'], senha: campos['senha'], btnLogar: true},
            success: (res) =>
            {
                var res_json = JSON.parse(res)
                if(res_json.status == 1)
                {
                    window.location.href = "admin";
                    localStorage.setItem("alerta", res_json.mensagem);
                }
                
                mostraMensagem(res_json.mensagem)
            },
            error: (erro) => 
            {
                console.log(erro.responseText);
            }
        })
    }
    //#endregion

    //#region  id = btnPesquisaCliente
    $(document).on("click", "#btnPesquisaCliente", () => 
    {
        pesquisaCliente({
            nomecliente: $("#nomeCliente").val(),
            cpf: $("#cpfCliente").cleanVal(),
            dataNascimento: $("#dataNascimento").val(),
            rg: $("#rgCliente").cleanVal(),
            telefone: $("#telefoneCliente").cleanVal()
        });
        
    })
    //#endregion

    //#region PESQUISACLIENTE

    function pesquisaCliente(campos)
    {
        $("#boxTabelaCliente").html(getLoader());
        $.ajax({
            url: "util/tabela-cliente.php",
            type: "post",
            data: campos,
            success: (res) =>
            {
                $("#boxTabelaCliente").html(res);
                $("#boxTabelaCliente").addClass("p-4");
            },
            error: (erro) => 
            {
                console.log(erro.responseText);
            }
        })
    }
    
    //#endregion

    //#region MOSTRAR MENSAGEM
    function mostraMensagem(msg)
    {
        var toastElList = [].slice.call(document.querySelectorAll('.toast'))
        var toastList = toastElList.map(function (toastEl) {
            return new bootstrap.Toast(toastEl, [])
        })

        $(".toast-body").html(msg);
        toastList[0].show()
    }
    //#endregion

    //#region VERIFICA MENSAGENS DO SISTEMA
    function verificaAlerta()
    {
        if(localStorage.getItem("alerta") != "")
        {
            mostraMensagem(localStorage.getItem("alerta"));
            localStorage.setItem("alerta", "");
        }
    }
    //#endregion

    //#region LOADER DA PESQUISA
    function getLoader()
    {
        return `<div id="containerSpinner">
                    <div class="shadow p-3 m-2 bg-body rounded" id="boxSpinner">
                        <div class="spinner-border text-secondary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>`;
    }
    //#endregion

    //#region BOTÃO PARA PULAR PAGINAS CLIENTE
    $(document).on("click", "#btnEnderecoCliente", () => 
    {
        $("#endereco-tab").trigger("click")
    })

    $(document).on("click", "#btnInformacoesBasicasCliente", () => 
    {
        $("#infoBasica-tab").trigger("click")
    })
    //#endregion

    //#region CARREGAR ENDEREÇOS DO CLIENTE
    if($("#bodyCardEndereco").is(":hidden"))
    {
        var cont = $("#cont").val();
        var id_pesquisa = $("#id_pesquisa").val();

        geraCamposEnderecoCliente(cont, id_pesquisa, "#bodyCardEndereco", $("#bodyCardEndereco")[0].children.length);
        adicionaMascaras();     
    }
    
    //#endregion

    //#region BUSCA ENDERECO CEP
    
    $(document).on("focusout", "#cepEndCliente", (e) =>
    {
        buscaEnderecoViaCep(e.target.value);
    })

    function buscaEnderecoViaCep(cep)
    {
        $.ajax({
            url: "http://viacep.com.br/ws/"+cep+"/json/ ",
            type: "get",
            data: {},
            success: (res) => {
                console.log(res)
            },
            erro: (error) => 
            {
                console.log(error)
            }
        })
    }
    //#endregion

    //#region GERAR CAMPOS DE ENDEREÇO DO CLIENTE
    function geraCamposEnderecoCliente(cont, id_pesquisa, div, contEnd)
    {
        var data = cont != "" ? {cont, id_pesquisa, opt: 1, contEnd} : {opt: 1, contEnd};

        $.ajax({
            type: "post",
            url: "util/gera-campos.php",
            data: data,
            success: (res) => 
            {
                $(div).append(res);
            },
            erro: (error) =>
            {
                console.log(error);
            }
        })
    }
    //#endregion

    //#region BOTÃO DE ADICIONAR CAMPO DE ENDERECO DO CLIENTE
    $(document).on("click", "#btnAddEndereco", () => 
    {
        geraCamposEnderecoCliente("", "", "#bodyCardEndereco", $("#bodyCardEndereco")[0].children.length);
    })
    //#endregion
 
    //#region REMOVE CAMPOS DE ENDEREÇO
    $(document).on("click", "#btnRemoveEndereco", (e) =>
    {
        var removeid = e.target.dataset.removeid

        removeCardCampos("#"+removeid)
    })
    function removeCardCampos(divFilho)
    {
        $(divFilho).remove();
    }
    //#endregion

    //#region CARREGAR INFORMAÇÕES CLIENTE
    //#endregion

    //#region BUTTON = btnSalvarCliente
    $(document).on("click", "#btnSalvarCliente", (e) =>
    {
        e.preventDefault();

        var erro = validaCampos(".force-check")

        $("#contEndereco").val($("#bodyCardEndereco")[0].children.length)

        erroCpf = validaDocumento("#cpf", 1)
        erroRg = validaDocumento("#rg", 2).then((res) => {console.log(res)});

        console.log(erroCpf)
        console.log(erroRg)
        if(erro == true || erroCpf == true || erroRg == true)
        {
            console.log(teste);
            mostraMensagem("Há campos vazis ou com inválidos! Tente novamente!");
            return false;
        }

        return false;
        $("#formularioCliente").submit();
    })
    //#endregion

    //#region 
    async function validaDocumento(campo, opt)
    {   
        var doc = $(campo).val();
        var erro = 0;
        return await Promise.resolve($.ajax({
                    type: "post",
                    url: "util/valida-campos.php",
                    data: {opt, doc},
                    success: (res) =>
                    {
                        if(res == 1)
                        {
                            $(campo).removeClass("invalidValue")
                            erro = false;
                        }
                        else
                        {
                            erro = true;
                            $(campo).addClass("invalidValue")
                        }
                        
                        return erro;
                    },
                    erro: (error) => 
                    {
                        console.log(error);
                    }
                }))
    }
})