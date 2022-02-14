<?php
require_once("../layout/cabecalho.php");

// O POST É PARA QUANDO VEM DA PESQUISA QUE É PASSADO PARA O cliente-form.php
// QUE IMPLEMENTA ESSE ARQUIVO
// if(isset($_POST["cont"]))
// {
//     $clienteFactory = new ClienteFactory();
//     $cliente = $clienteFactory->criaCliente($_SESSION["lista_cliente".$_POST["id_pesquisa"]][$_POST["cont"]]);

//     $controller = "controller/altera-cliente.php";
// }
// else
// {
//     $controller = "controller/adiciona-cliente.php";
//     $_POST['cont'] = "";
//     $_POST['id_pesquisa'] = "";
// }

?>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <div class="shadow p-3 mb-4 mt-4 bg-body rounded text-center h3">CADASTRO CLIENTE</div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <ul class="nav nav-tabs nav-fill">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="infoBasica-tab" data-bs-toggle="tab" data-bs-target="#infoBasica" type="button" role="tab" aria-controls="infoBasica" aria-selected="true">Informações Básicas</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="endereco-tab" data-bs-toggle="tab" data-bs-target="#endereco" type="button" role="tab" aria-controls="endereco" aria-selected="false">Endereço</button>
                </li>
            </ul>
            <div class="tab-content bg-body pt-4" id="myTabContent">

                <form action="controller/adiciona-cliente.php" id="formularioCliente" method="post">
                    <div class="tab-pane fade show active" id="infoBasica" role="tabpanel" aria-labelledby="infoBasica-tab">
                        <?php
                            require_once("../view/cliente-form-infoBasicas.php");
                        ?>
                        <div class="row mb-4">
                            <div class="col d-flex justify-content-end align-center">
                                <a class="btn btn-primary m-2" id="btnEnderecoCliente">
                                    Endereço <i class="fas fa-arrow-alt-circle-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="endereco" role="tabpanel" aria-labelledby="endereco-tab">
                        <?php
                            require_once("../view/cliente-form-infoEndereco.php");
                        ?>

                        <div class="row mb-2">
                            <div class="col d-flex justify-content-center align-center">
                                <button class="btn btn-primary">
                                    <i class="fas fa-save"></i> Salvar
                                </button>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col d-flex justify-content-start align-center">
                                <a class="btn btn-primary m-2" id="btnInformacoesBasicasCliente">
                                    <i class="fas fa-arrow-alt-circle-left"></i> Informações Básicas
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php
require_once("../layout/rodape.php");