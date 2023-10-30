const sqlite3 = require ('sqlite3').verbose();
const db_agendamento = new sqlite3.Database('./agendamento.db')

db_agendamento.serialize( () => {
    db_agendamento.run(`CREATE TABLE IF NOT EXISTS Agenda_Nova (
        id integer primary key,
        data date,
        hora time,
        paciente varchar(100),
        medico varchar(100),
        status varchar (100)
    )`
    )
});

module.exports = db_agendamento;