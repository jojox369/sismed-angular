// função que compara a data do agendamento com a data atual para saber se é possivel editar um agendamento ou não
export function CompareDates(agendamentoDate: string): boolean {
  const todayDate = new Date();
  const agendamentoDateArray = agendamentoDate.split('-');
  const todayArray = todayDate.toLocaleDateString().split('/');

  // Informações sobre a data atual
  const todayYear = Number(todayArray[2]);
  const todayMonth = Number(todayArray[1]);
  const todayDay = Number(todayArray[0]);

  // Informações da data do agendamento
  const agendamentoYear = Number(agendamentoDateArray[0]);
  const agendamentoMonth = Number(agendamentoDateArray[1]);
  const agendamentoDay = Number(agendamentoDateArray[2]);

  // Caso seja ano diferente, não é editavel
  if (agendamentoYear < todayYear) {
    return false;
  }
  // Caso seja mes diferente, não é editavel
  else if (agendamentoMonth < todayMonth) {
    return false;
  }
  // Caso seja dia diferente, não é editavel
  else if (
    agendamentoDay < todayDay &&
    agendamentoMonth === todayMonth &&
    agendamentoYear === todayYear
  ) {
    return false;
  } else {
    /*Se cair nessa condição, isso quer dizer que a data do agendamento é igual ou maior que a data atual
    ou seja, o agendamento é editavel
  */
    return true;
  }
}
