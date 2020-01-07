import React, { Component } from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap'

export default class AddDep extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className="container">
                <Row>
                    <Col sm={6}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="departmentName">
                                <Form.Label>Department Name</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Department Name"
                                    name="departmentName"
                                // value={values.zip}
                                // onChange={handleChange}
                                // isInvalid={!!errors.zip}
                                />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}
