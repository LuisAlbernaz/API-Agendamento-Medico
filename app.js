const express = require('express');
const db_agendamento = require('./db_agendamento');

const app = express();
app.use(express.json());

app.get('/Agenda', (req, res) => {
    db_agendamento.all('SELECT * FROM Agenda_Nova', (erro, Agenda) => {
        if (erro !== null) {
            console.error(erro);
            res.status(500).json({ mensagem: 'Erro no Servidor' });
        } else {
            res.json(Agenda);
        }
    });
});

app.post('/Agenda', (req, res) => {
    const { id, data, hora, paciente, medico, status } = req.body;

    const consultaData = new Date(data + ' ' + hora);
    const dataAtual = new Date();

    if (consultaData <= dataAtual) {
        return res.status(400).json({ mensagem: 'A data da consulta deve ser no futuro' });
    }

    const query = 'SELECT COUNT(*) as count FROM Agenda_Nova WHERE data = ? AND hora = ? AND medico = ?';
    db_agendamento.get(query, [data, hora, medico], (erro, row) => {
        if (erro !== null) {
            console.error(erro);
            res.status(500).json({ mensagem: 'Ocorreu um erro no Servidor' });
        } else {
            const count = row.count;

            if (count > 0) {
                res.status(400).json({ mensagem: 'Já existe um agendamento para o mesmo médico, data e hora' });
            } else {
                const inserirQuery = 'INSERT INTO Agenda_Nova (id, data, hora, paciente, medico, status) VALUES (?, ?, ?, ?, ?, ?)';
                db_agendamento.run(inserirQuery, [id, data, hora, paciente, medico, status], (erro) => {
                    if (erro !== null) {
                        console.error(erro);
                        res.status(500).json({ mensagem: 'Ocorreu um erro no Servidor' });
                    } else {
                        res.status(201).json({ id, data, hora, paciente, status });
                    }
                });
            }
        }
    });
});


app.delete('/Agenda', (req, res) => {
    const id = req.body.id;
    db_agendamento.run('DELETE FROM Agenda_Nova WHERE id = ?', [id], (erro) => {
        if (erro !== null) {
            console.error(erro);
            res.status(500).json({ mensagem: 'Ocorreu um erro no Servidor' });
        } else {
            res.status(201).json({ mensagem: 'Agendamento Deletado com Sucesso!' });
        }
    });
});


app.listen(3030, () => {
    console.log('Servidor Executando em localhost:3030');
});
