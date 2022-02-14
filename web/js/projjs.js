$(document).ready(() =>
{
    //#region DISPARA FUNÇÕES DE INICIALIZAÇÃO
    verificaAlerta();
    //#endregion

    //#region MASKS
    $('.cpf').mask('000.000.000-00', {placeholder: "___.___.___-__"});
    $('.data').mask('00/00/0000', {placeholder: "__/__/____"});
    $('.rg').mask('00.000.000-0', {placeholder: "__.___.___-_"});
    $('.celular').mask('(00) 0 0000-0000', {placeholder: "(__) _ ____-____"})
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

    //#region DISPARA O EVENTO NO LOAD DA PAGINA
    $("#boxTabelaCliente").ready(() => {
        console.log("teste");
        $("#btnPesquisaCliente").trigger("click");
    })
    //#endregion
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

    //#region BOTÃO PARA ADICIONAR ENDEREÇO DO CLIENTE
    $(document).on("click", "#btnAddEndereco", () => {
        
    })

    //#endregion
    
    //#region CARREGAR INFORMAÇÕES CLIENTE
    //#endregion
})