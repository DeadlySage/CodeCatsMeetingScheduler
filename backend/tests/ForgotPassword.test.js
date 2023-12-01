const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server')[0];
let connect = require('../server')[1];
const User = require('../models/user');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Forgot Password API Calls', () => {
    let saveStub; 
    let userFindOneStub;

    beforeAll(async () => {
        // Create a stub for the connect function
        connectStub = sinon.stub();
        connectStub.returns(Promise.resolve()); // You can adjust this based on the behavior you want to mimic

        // Replace the actual connect function with the stub
        connect = connectStub;
        
        // Call the connect function
        await connect();
    });

    beforeEach(() => {
        saveStub = sinon.stub(User.prototype, 'save').resolves();
        userFindOneStub = sinon.stub(User, 'findOne');
    })

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /api/users/', () => {
        it('does not find a nonexsting account', async () => {

            const wrongEmail = 'wrongEmail@csus.edu';

            userFindOneStub.returns([]);

            const res = await chai
                .request(app)
                .get(`/api/users/`)
                .query({ email: wrongEmail });

            expect(res).to.have.status(200);
            expect(res.data).to.be.undefined;

            sinon.assert.calledOnce(userFindOneStub);
        });

        it('correctly finds an existing account', async () => {

            const email = 'wrongEmail@csus.edu';

            const userData = new User ({
                id : '6451c0cd09b4910545248bd7',
                email: 'wrongEmail@csus.edu',
            });

            userFindOneStub.returns(userData);

            const res = await chai
                .request(app)
                .get(`/api/users/`)
                .query({ email: email });

            console.log(res.data);
            expect(res).to.have.status(200);
            expect(res.data).to.not.be.undefined;

            sinon.assert.calledOnce(userFindOneStub);
        });
    });
});