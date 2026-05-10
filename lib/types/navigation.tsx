export type company = {
    name: string
    logo: string
    contact_details: {
        adress_line: string,
        city: string,
        postal_code: string,
        country: string
    }
    payment_details: {
        bsb: string,
        account_number: string
    }
};