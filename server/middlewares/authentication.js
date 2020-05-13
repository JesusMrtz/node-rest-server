const jwt = require('jsonwebtoken');



/**
 * Verificar token
 */

let verifyToken = (request, response, next) => {
    let token = request.get('Authorization');

    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                ok: false,
                error
            });
        }

        request.user = decoded.data;

        next();
    });
};

let verifyTokenUseAdmin = (request, response, next) => {
    let user = request.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return response.json({
            ok: false,
            error: {
                message: 'El usuario no es administrador'
            }
        });
    }
};


module.exports = {
    verifyToken,
    verifyTokenUseAdmin
};