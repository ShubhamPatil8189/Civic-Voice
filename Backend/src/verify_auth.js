const mongoose = require('mongoose');
require('dotenv').config();
const authController = require('./controllers/authController');
const User = require('./models/User');

// Mock Request and Response
const mockReq = (body) => ({
    body,
});

const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

// Mock express-validator result
// We need to mock validationResult in authController... 
// Since we can't easily mock require in this simple script without tools, 
// we assume valid data passes validation if we just call the controller function directly. 
// BUT validationResult(req) is called inside controller.
// We need to bypass it or mock the request such that validationResult checks it?
// validationResult looks at req object. 
// But validationResult(req) checks validation errors attached to req by previous middleware.
// If we bypass middleware, validationResult(req).isEmpty() might default to true if no errors are attached?
// Yes, if we don't run the validator middleware, req['express-validator#contexts'] is undefined. 

const runVerification = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in .env');
            // Try to find it or ask user?
            // process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const testEmail = 'test_minimal_auth@example.com';

        // Cleanup
        await User.deleteOne({ email: testEmail });
        console.log('Cleaned up previous test user');

        // 1. Register
        console.log('--- Testing Registration ---');
        const regReq = mockReq({
            firstName: 'Test',
            email: testEmail,
            dateOfBirth: '2000-01-01',
            age: 23
        });
        // We need to attach validationResult helper if possible, or mocked middleware?
        // Actually, validationResult(req) returns an object with isEmpty().
        // If we didn't run the middleware, validationResult might fail or return empty errors?
        // Let's assume express-validator works such that if no errors property, it is empty.
        // But authController imports validationResult from express-validator. 
        // We can't change that import.
        // However, if we just run the controller, validationResult(req) will try to find errors.
        // Let's trust that passing valid-looking req object is enough if we mock the validator state? No.
        // We can stub validationResult if we use a test framework.
        // Here we are running raw node.

        // Strategy: We will hack the validationResult by mocking it? 
        // No, we can't easily.
        // Maybe we just run the code? 
        // express-validator attaches errors to _validationErrors or similar.
        // If they are missing, isEmpty() is likely true.
        // Let's try.

        const regRes = mockRes();

        // Mock validation mock for req (if express-validator expects something)
        // Usually it expects req._validationContexts or similar. 
        // If undefined, validationResult(req).isEmpty() returns true? 
        // Let's hope so.
        // Wait, `validationResult` function checks `req`.

        await authController.register(regReq, regRes);
        console.log('Register Response:', regRes.statusCode, regRes.data);

        if (regRes.statusCode !== 200 && regRes.statusCode !== 201) {
            console.error('Registration failed.');
            // If failed due to email, we still proceed to check user in DB
        }

        // 2. Check User in DB and get OTP
        const user = await User.findOne({ email: testEmail });
        if (!user) {
            console.error('User not found in DB!');
            process.exit(1);
        }
        console.log('User created in DB:', user._id);

        // Check OTP directly (since it is hashed, we can't get plain OTP easily to verify!)
        // WAIT. I hashed the OTP in the controller: 
        // user.emailOtp = await bcrypt.hash(otp, salt);
        // I CANNOT retrieve the plain OTP from the DB to send it in the verify request!
        // This makes automated testing hard without mocking the random generator or the hash.

        // But I added a console.log('DEV OTP:', otp) in the controller.
        // I can read the stdout? No, this script is running the controller in the same process.
        // I can hook console.log?

        let capturedOtp = null;
        const originalLog = console.log;
        console.log = (...args) => {
            originalLog(...args);
            if (args[0] === 'DEV OTP:') {
                capturedOtp = args[1];
            }
        };

        // Re-run register to capture OTP? No, user already exists.
        // Delete and re-run.
        await User.deleteOne({ email: testEmail });

        console.log('--- Re-running Registration to capture OTP ---');
        await authController.register(regReq, regRes);

        console.log = originalLog; // Restore

        if (!capturedOtp) {
            console.error('Could not capture OTP from logs. Did you add the log?');
            // Proceed anyway? No point.
            // Maybe the user creation failed in the re-run?
            // Or validation failed?
        }
        console.log('Captured OTP:', capturedOtp);

        if (capturedOtp) {
            // 3. Verify OTP
            console.log('--- Testing Verify OTP ---');
            const verifyReq = mockReq({
                email: testEmail,
                otp: capturedOtp
            });
            const verifyRes = mockRes();

            await authController.verifyEmailOTP(verifyReq, verifyRes);
            console.log('Verify Response:', verifyRes.statusCode, verifyRes.data);

            if (verifyRes.data && verifyRes.data.token) {
                console.log('SUCCESS: Token received!');
            } else {
                console.error('FAILURE: Token not received.');
            }
        }

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

runVerification();
