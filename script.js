;
(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempoPreco(mil, precoHora) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        const precoPagar = precoHora * (min / 60 + sec / 3600);
        return `${min}m e ${sec}s resultando em ${precoPagar.toFixed(2)} reais`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement('tr');
            row.innerHTML = `
      <td>${veiculo.nome}</td>
      <td>${veiculo.placa}</td>
      <td>${veiculo.entrada}</td>
      <td>
      <button class='delete' data-placa='${veiculo.placa}'> X </button>
      
      </td>
      `;
            (_a = row.querySelector('.delete')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                remover(this.dataset.placa);
            });
            (_b = $('#patio')) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva) {
                salvar([...ler(), veiculo]);
            }
        }
        function remover(placa) {
            var _a;
            if (Number($('#preco').value)) {
                const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
                const tempo = calcTempoPreco(new Date().getTime() - new Date(entrada).getTime(), Number((_a = $('#preco')) === null || _a === void 0 ? void 0 : _a.value));
                if (!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`))
                    return;
                salvar(ler().filter(veiculo => veiculo.placa !== placa));
                render();
            }
            else
                return alert('Preço invalido! Insira um número!');
        }
        function salvar(veiculos) {
            localStorage.setItem('patio', JSON.stringify(veiculos));
        }
        function render() {
            $('#patio').innerHTML = '';
            const patio = ler();
            if (patio.length) {
                patio.forEach(veiculo => adicionar(veiculo, false));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    patio().render();
    (_a = $('#cadastrar')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const nome = (_a = $('#nome')) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $('#placa')) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert('Os campos nome e placa são obrigatórios');
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
