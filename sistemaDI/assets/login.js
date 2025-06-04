// Quando a página terminar de carregar, executa o código
document.addEventListener('DOMContentLoaded', function () {
    // Pega o formulário de login
    const formularioLogin = document.getElementById('login');

    // Quando o formulário for enviado
    formularioLogin.addEventListener('submit', function (event) {
        // Impede que a página recarregue
        event.preventDefault();

        // Pega o que foi digitado nos campos de usuário e senha
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        // Verifica se o usuário e senha estão corretos
        if (validarCredenciais(usuario, senha)) {
            // Mostra mensagem de sucesso
            exibirMensagem('Login realizado com sucesso!', 'sucesso');
            // Vai para a página principal depois de 1,5 segundos
            setTimeout(function () {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Mostra mensagem de erro
            exibirMensagem('Usuário ou senha incorretos!', 'erro');
        }
    });

    // Verifica se o usuário e senha estão certos
    function validarCredenciais(usuario, senha) {
        // Lista com usuários permitidos
        const usuariosValidos = [{ usuario: 'admin', senha: 'admin123' }];
        // Retorna verdadeiro se encontrar um usuário igual
        return usuariosValidos.some(user => user.usuario === usuario && user.senha === senha);
    }

    // Mostra uma mensagem na tela
    function exibirMensagem(texto, tipo) {
        // Cria uma nova mensagem
        const divMensagem = document.createElement('div');
        divMensagem.className = `alert alert-${tipo === 'sucesso' ? 'success' : 'danger'} mt-3`;
        divMensagem.textContent = texto;

        // Adiciona a mensagem dentro do elemento com a classe "cartao"
        const cartao = document.querySelector('.cartao');
        cartao.appendChild(divMensagem);

        // Remove a mensagem depois de 3 segundos
        setTimeout(function () {
            divMensagem.remove();
        }, 3000);
    }
});
