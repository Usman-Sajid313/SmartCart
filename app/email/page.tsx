// app/email/page.tsx
'use client'

import { Html } from '@react-email/html'
import { Heading } from '@react-email/heading'
import { Text } from '@react-email/text'
import { Container } from '@react-email/container'
import { Section } from '@react-email/section'
import { Row } from '@react-email/row'
import { Column } from '@react-email/column'

export default function Email() {
    const shipping = {
        firstName: 'Asad',
        lastName: 'Ali',
        address: '123 Street Rd',
        city: 'Lahore',
        postal: '54000',
        phone: '03001234567'
    }

    const items = [
        { name: 'T-Shirt', quantity: 2, size: 'M', price: 25 },
        { name: 'Shoes', quantity: 1, size: '10', price: 60 }
    ]

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const balance = 200
    const newBalance = balance - subtotal

    return (
        <Html>
            <Container style={{ padding: '20px', fontFamily: 'Arial' }}>
                <Heading>Order Confirmation</Heading>
                <Text>
                    Thank you for your order, {shipping.firstName} {shipping.lastName}!
                </Text>

                <Section>
                    <Text><strong>Shipping Address:</strong></Text>
                    <Text>{shipping.address}, {shipping.city}, {shipping.postal}</Text>
                    <Text>Phone: {shipping.phone}</Text>
                </Section>

                <Section>
                    <Text><strong>Order Summary:</strong></Text>
                    {items.map((item, index) => (
                        <Row key={index}>
                            <Column>{item.name}</Column>
                            <Column>Qty: {item.quantity}</Column>
                            <Column>Size: {item.size}</Column>
                            <Column>${item.quantity * item.price}</Column>
                        </Row>
                    ))}
                </Section>

                <Section>
                    <Text><strong>Subtotal:</strong> ${subtotal}</Text>
                    <Text><strong>Previous Balance:</strong> ${balance}</Text>
                    <Text><strong>New Balance:</strong> ${newBalance}</Text>
                </Section>
            </Container>
        </Html>
    )
}
