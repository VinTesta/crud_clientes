<?php
require_once("../layout/dao-loader.php");

if(isset($_POST["nomecliente"]))
{
    try
    {
        $conn = new ConexaoMySql();
        $clienteDao = new ClienteDao($conn);
        $enderecoDao = new EnderecoDao($conn);
        
        $conexao = $clienteDao->getConn();
        $enderecoDao->setConn($conexao);
        $conexao->beginTransaction();

        if(isset($_POST["cont"]) && $_POST["cont"] != "")
        {// ALTERAR O CLIENTE
            $idCliente = $_SESSION["lista_cliente" . $_POST["id_pesquisa"]][$_POST["cont"]]["idcliente"];
            $enderecosCliente = trataEnderecoForm($_POST, $_POST["contEndereco"]);

            if(count($enderecosCliente) > 0)
            {
                $res_add_cli = $clienteDao->update($idCliente, $_POST);
                $enderecos = $enderecoDao->comparaEnderecoCliente($idCliente, $enderecosCliente);

                foreach($enderecos["alt_endereco"] as $alt_end)
                {
                    $end_alt = $enderecoDao->update($alt_end["idendereco"], $alt_end);
                }

                foreach($enderecos["adicionar"] as $key => $add)
                {// ADICIONA NOVOS ENDEREÇOS
                    $res_end = $enderecoDao->insert($add);

                    $res_add_end = $enderecoDao->insertEnderecoCliente($idCliente, $res_end["insertId"]);
                }

                foreach($enderecos["remover"] as $key => $remove)
                {// REMOVE ENDEREÇOS
                    $res_remov = $enderecoDao->delete($remove["idendereco"]);
                }

            }
        }   
        else
        {// ADICIONAR O CLIENTE
            $enderecosCliente = trataEnderecoForm($_POST, $_POST["contEndereco"]);
            if(count($enderecosCliente) > 0)
            {
                $res_add_cli = $clienteDao->insert($_POST);
                
                foreach($enderecosCliente as $end)
                {
                    $resultado_end = $enderecoDao->insert($end);

                    $resultado = $enderecoDao->insertEnderecoCliente($res_add_cli["insertId"], $resultado_end["insertId"]);
                }
            }
        }

        if($res_add_cli["erro"][1] == null)
        {
            ?>
            <script>
                localStorage.setItem("alerta", "Cadastro/Alteração realizado(a) com sucesso!");
                location = "../pesquisa-cliente";
            </script>
            <?php
        }
        else
        {
            ?>
            <script>
                localStorage.setItem("alerta", "Houve um erro ao fazer o(a) cadastro/alteração do usuario");
                location = "../pesquisa-cliente";
            </script>
            <?php
        }

        $conexao->commit();
    }
    catch(Exception $ex)
    {
        $conexao->rollback();
        ?>
        <script>
            localStorage.setItem("alerta", "Houve um erro no cadastro/alteração; Erro:".$ex);
            location = "../pesquisa-cliente";
        </script>
        <?php
    }

    // redireciona("../pesquisa-cliente", []);
}