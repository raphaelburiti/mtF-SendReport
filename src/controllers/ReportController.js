const Customer = require('../models/Customer')

module.exports = {

  async report(req, res) {

    const { orderServices, dataUser } = req.body
    // console.log(orderServices, dataUser)

    const calleds = orderServices

    var id_customer = [];

    calleds.forEach(e => {
      // console.log(e)
      id_customer.push(e.id_customer)
    });

    var id_customerUpper = [];
    id_customer.forEach(e => {
      id_customerUpper.push(e.toUpperCase())
    })

    var customers = []
    var customersNotFound= []

    for (var element of id_customerUpper) {

      const customer = await Customer.findOne({
        id_customer: { $eq: element }
      })

      if (customer) {

        customers.push(customer)

      }

      if (!customer) {
        customersNotFound.push(element)
      }

    }
    //retorna a sigla do cliente caso ele não esteja cadastrado
    if (customersNotFound.length > 0) {

      return res.status(404).json({ message: 'Cliente ' + customersNotFound + ' não está cadastrado!' })

    }

    var i = 0
    var count = 0

    var numberOfCalleds = calleds.length;

    const reports = []

    calleds.forEach(call => {

      if (i == 0) {

        let data;

        data = calleds[i].date_service.slice(8, 10) + '/' + calleds[i].date_service.slice(5, 7) + '/' + calleds[i].date_service.slice(0, 4)

        codigo = calleds[i].id_service
        valor = calleds[i].distance_service * 0.6.toString()

        descricao = `De: ${'Base'} (${dataUser.address}) para: ${calleds[i].id_customer} (${customers[i].address}) Distâcia ${calleds[i].distance_service} Km`

        reports.push([codigo, data, valor, descricao])

      }

      if (i > 0 && i < numberOfCalleds - 1) {

        let data;
        data = calleds[i].date_service.slice(8, 10) + '/' + calleds[i].date_service.slice(5, 7) + '/' + calleds[i].date_service.slice(0, 4)

        codigo = calleds[i].id_service
        valor = calleds[i].distance_service * 0.6.toString()
        descricao = `De: ${calleds[i - 1].id_customer} (${customers[i - 1].address}) para: ${customers[i].id_customer} (${customers[i].address}) Distâcia ${calleds[i].distance_service} Km`

        reports.push([codigo, data, valor, descricao])
      }

      if (i == numberOfCalleds - 1) {
        // console.log(calleds[i])
        let data;
        data = calleds[i].date_service.slice(8, 10) + '/' + calleds[i].date_service.slice(5, 7) + '/' + calleds[i].date_service.slice(0, 4)

        codigo = calleds[i].id_service
        valor = calleds[i].distance_service * 0.6.toString()
        descricao = `De: ${calleds[i - 1].id_customer} (${customers[i - 1].address}) para: ${'Base'} (${dataUser.address}) Distâcia ${calleds[i].distance_service} Km`

        reports.push([codigo, data, valor, descricao])
      }

      i++

    })

    var webdriver = require('selenium-webdriver'),
      By = webdriver.By

    var driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();

    async function runInsert(data) {
      await driver.get(`https://${dataUser.user_pcs2}:${dataUser.password_pcs2}@pcs2.sondait.com.br/pcs2/index1.asp`)
      await driver.get("https://pcs2.sondait.com.br/pcs2/maestroPw/Despesas/Pesquisar.aspx")
      await driver.findElement(By.id('rptEmpresas__ctl0_dbListar__ctl2_lnkSelecionar')).click()
      //await driver.get(https://pcs2.sondait.com.br/pcs2/maestroPw/Despesas/Lancamento.aspx?cd_OS={}&cd_Recurso={})
      const url = await driver.getCurrentUrl()
      await driver.get(url)

      var chamados = data

      for (var i of chamados) {
        await driver.findElement(By.id('cboTipoDespesas')).sendKeys('QUILOMETRAGEM')
        await driver.findElement(By.id('txtData')).sendKeys(i[1].replace('/', ''))
        await driver.findElement(By.id('txtValor')).sendKeys(i[2].toString().replace('.', ','))
        await driver.findElement(By.id('txtDescricao')).sendKeys(i[3])
        await driver.findElement(By.id('txtComprovante')).sendKeys(i[0])
        await driver.findElement(By.id('imgAdicionar')).click()

        // count = count + 1
      }
      // await Promise.all(promises)
    }

    await runInsert(reports)
      .then(async () => {
        await driver.close()
        
        return res.status(200).json({ message: 'Despesas enviadas com sucesso!' })
      })
      .catch(async (response) => {
        await driver.close()

        if (response.name === 'NoSuchElementError') {
          return res.status(401).json({ message:'Erro durante autenticação no pcs2!' })
        }

        return res.status(400).json({ message: 'Erro no envio das despesas!' })
      })
  }
}