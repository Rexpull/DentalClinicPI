import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'react-datepicker/dist/react-datepicker.css';
import CurrencyInputField from 'react-currency-input-field';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
    import { format } from 'date-fns';


function Header() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    num_docto: '',
    fornecedor: '',
    dt_lancamento: '',
    dt_vencimento: '',
    valor: '',
    observacao: '',
    situacao: ''
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isValidDate = (date) => {
    // Verifica se a data é um objeto do tipo Date
    if (!(date instanceof Date)) return false;

    // Extrai o ano, mês e dia da data
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Verifica se o ano está no intervalo esperado (pode ser ajustado conforme necessário)
    if (year < 1900 || year > 2100) return false;

    // Verifica se o mês está no intervalo de 1 a 12
    if (month < 1 || month > 12) return false;

    // Verifica se o dia está no intervalo válido para o mês
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > lastDayOfMonth) return false;

    // A data é válida
    return true;
  };

  const handleDateChange = (name, date) => {
    if (isValidDate(date)) {
      if (name === 'dt_lancamento') {
        setStartDate(date);
      } else if (name === 'dt_vencimento') {
        setEndDate(date);
      }
    } else {
      console.log('Data inválida');
    }
  };
  

  const verificarSituacao = () => {
    const now = new Date();
    const formattedEndDate = endDate ? new Date(endDate) : null;
      
    if (formattedEndDate && formattedEndDate <= now) {
      return 'Vencido';
    } else {
      return 'Em Aberto';
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const situacao = verificarSituacao();

    const formattedData = {
      ...formData,
      dt_lancamento: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      dt_vencimento: endDate ? format(endDate, 'yyyy-MM-dd') : '',
      situacao: situacao
    };
    

    try {
      const response = await API.post('/addmhs.php', formattedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);

      handleClose();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="nav">
              <button onClick={handleShow} className="button-28">
                <FontAwesomeIcon icon={faPlus} className="fa-icon-plus" /> Lançar conta
              </button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title><FontAwesomeIcon icon={faPlus} className="fa-icon-plus" color='green' /> Adicionar Cadastro</Modal.Title>
          <Button variant="link" className="close-btn" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} className="fa-icon-xmark" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="num_docto">
              <Form.Label>
                Numero do Documento <span className="required-add">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="num_docto"
                value={formData.num_docto}
                onChange={handleChange}
                placeholder="001"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="fornecedor">
              <Form.Label>
                Fornecedor <span className="required-add">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="fornecedor"
                value={formData.fornecedor}
                onChange={handleChange}
                placeholder="Fornecedor"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="dt_lancamento">
              <Form.Label>
                Data de Emissão <span className="required-add">*</span>
              </Form.Label>
              <DatePicker
                className="form-control"
                selected={startDate}
                onChange={(date) => handleDateChange('dt_lancamento', date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Selecione a data"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="dt_vencimento">
              <Form.Label>
                Data de Vencimento <span className="required-add">*</span>
              </Form.Label>
              <DatePicker
                className="form-control"
                selected={endDate}
                onChange={(date) => handleDateChange('dt_vencimento', date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Selecione a data"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="valor">
              <Form.Label>
                Valor <span className="required-add">*</span>
              </Form.Label>
              <CurrencyInputField
                className="form-valor"
                prefix="R$"
                decimalSeparator="."
                groupSeparator=","
                decimalScale={2}
                value={formData.valor}
                onValueChange={(value) => setFormData({ ...formData, valor: value })}
                placeholder="0.00"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="observacao">
              <Form.Label>Observacao</Form.Label>
              <Form.Control
                type="text"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                placeholder="Observação (opcional)"
              />
            </Form.Group>

            <Modal.Footer className="custom-footer">
              <Button variant="primary" type="submit">
                Criar novo
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Header;
