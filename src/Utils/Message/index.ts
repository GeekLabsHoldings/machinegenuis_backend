const generateWelcomeEmail = (email: string, password: string): string => {
    return `
        <html>
            <body>
                <h1>Welcome to Geek Labs Holding!</h1>
                <p>Dear New Employee,</p>
                <p>We are excited to have you join our company. Here are your login details:</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>Please keep this information secure and do not share it with anyone.</p>
                <p>Best Regards,</p>
                <p>Geek Labs Holding</p>
            </body>
        </html>
    `;
}

enum HiringEmailEnum {
    WELCOME_MESSAGE = 'Welcome to Geek Labs Holding',
}

export {
    HiringEmailEnum,
    generateWelcomeEmail

}