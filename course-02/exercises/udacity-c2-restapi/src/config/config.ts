export const config = {
    dev: {
        database: process.env.POSTGRES_DATABASE,
        dialect: "postgres",
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        aws_region: process.env.AWS_REGION,
        aws_profile: process.env.AWS_PROFILE,
        aws_media_bucket: process.env.AWS_MEDIA_BUCKET,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    prod: {
        username: "",
        password: "",
        database: "udagram_prod",
        host: "",
        dialect: "postgres",
    },
};
