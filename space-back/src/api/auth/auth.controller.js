const Joi = require('joi');
const Account = require('models/Account');

// 로컬 회원가입
exports.localRegister = async(ctx) => {
    // 데이터 검증
    const schema = Joi
        .object()
        .keys({
            username: Joi
                .string()
                .alphanum()
                .min(4)
                .max(15)
                .required(),
            email: Joi
                .string()
                .email()
                .required(),
            password: Joi
                .string()
                .required()
                .min(6)
        });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.status = 400;
        return;
    }

    /* TODO: 아이디 / 이메일 중복처리 구현 */

    // 계정 생성
    let account = null;
    try {
        account = await Account.localRegister(ctx.request.body);
    } catch (e) {
        ctx.throw(500, e);
    }

    let token = null;
    try {
        token = await account.generateToken();
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx
        .cookies
        .set('access_token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
    ctx.body = account.profile; // 프로필 정보로 응답합니다.
};

exports.localLogin = async(ctx) => {
    // 데이터 검증
    const schema = Joi
        .object()
        .keys({
            email: Joi
                .string()
                .email()
                .required(),
            password: Joi
                .string()
                .required()
        });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.status = 400; // Bad Request
        return;
    }

    const {email, password} = ctx.request.body;

    let account = null;
    try {
        // 이메일로 계정 찾기
        account = await Account.findByEmail(email);
    } catch (e) {
        ctx.throw(500, e);
    }

    if (!account || !account.validatePassword(password)) {
        // 유저가 존재하지 않거나 || 비밀번호가 일치하지 않으면
        ctx.status = 403;
        return;
    }

    let token = null;
    try {
        token = await account.generateToken();
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx
        .cookies
        .set('access_token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
    ctx.body = account.profile; // 프로필 정보로 응답합니다.
};

// 이메일 / 아이디 존재유무 확인
exports.exists = async(ctx) => {
    ctx.body = 'exists';
};

// 로그아웃
exports.logout = (ctx) => {
    ctx
        .cookies
        .set('access_token', null, {
            maxAge: 0,
            httpOnly: true
        });
    ctx.status = 204;
};

//check
exports.check = (ctx) => {
    const {user} = ctx.request;

    if (!user) {
        ctx.status = 403; // Forbidden
        return;
    }

    ctx.body = user.profile;
};