document.addEventListener('DOMContentLoaded', function () {
    const formularioLogin = document.getElementById('login');

    formularioLogin.addEventListener('submit', function (event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        if (validarCredenciais(usuario, senha)) {
            exibirMensagem('Login realizado com sucesso!', 'sucesso');
            setTimeout(function () {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            exibirMensagem('Usuário ou senha incorretos!', 'erro');
        }
    });

    function validarCredenciais(usuario, senha) {
        const usuariosValidos = [{ usuario: 'admin', senha: 'admin123' }];
        return usuariosValidos.some(user => user.usuario === usuario && user.senha === senha);
    }

    function exibirMensagem(texto, tipo) {
        const divMensagem = document.createElement('div');
        divMensagem.className = `alert alert-${tipo === 'sucesso' ? 'success' : 'danger'} mt-3`;
        divMensagem.textContent = texto;

        const cartao = document.querySelector('.cartao');
        cartao.appendChild(divMensagem);

        setTimeout(function () {
            divMensagem.remove();
        }, 3000);
    }
});
