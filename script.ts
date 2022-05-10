interface Veiculo {
  nome: string
  placa: string
  entrada: Date | string
}

;(function () {
  const $ = (query: string): HTMLInputElement | null =>
    document.querySelector(query)

  function calcTempoPreco(mil: number, precoHora: number) {
    const min = Math.floor(mil / 60000)
    const sec = Math.floor((mil % 60000) / 1000)
    const precoPagar = precoHora * (min / 60 + sec / 3600)

    return `${min}m e ${sec}s resultando em ${precoPagar.toFixed(2)} reais`
  }

  function patio() {
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : []
    }

    function adicionar(veiculo: Veiculo, salva: boolean) {
      const row = document.createElement('tr')
      row.innerHTML = `
      <td>${veiculo.nome}</td>
      <td>${veiculo.placa}</td>
      <td>${veiculo.entrada}</td>
      <td>
      <button class='delete' data-placa='${veiculo.placa}'> X </button>
      
      </td>
      `
      row.querySelector('.delete')?.addEventListener('click', function () {
        remover(this.dataset.placa)
      })

      $('#patio')?.appendChild(row)
      if (salva) {
        salvar([...ler(), veiculo])
      }
    }

    function remover(placa: string) {
      if (Number($('#preco').value)) {
        const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa)
        const tempo = calcTempoPreco(
          new Date().getTime() - new Date(entrada).getTime(),
          Number($('#preco')?.value)
        )

        if (
          !confirm(
            `O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`
          )
        )
          return

        salvar(ler().filter(veiculo => veiculo.placa !== placa))
        render()
      } else return alert('Preço invalido! Insira um número!')
    }

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem('patio', JSON.stringify(veiculos))
    }

    function render() {
      $('#patio')!.innerHTML = ''
      const patio = ler()
      if (patio.length) {
        patio.forEach(veiculo => adicionar(veiculo, false))
      }
    }

    return { ler, adicionar, remover, salvar, render }
  }

  patio().render()

  $('#cadastrar')?.addEventListener('click', () => {
    const nome = $('#nome')?.value
    const placa = $('#placa')?.value

    if (!nome || !placa) {
      alert('Os campos nome e placa são obrigatórios')
      return
    }
    patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true)
  })
})()
