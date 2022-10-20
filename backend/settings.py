import pydantic

class BaseSettings(pydantic.BaseSettings):
    class Config:
        env_file = ".env"

class MongoSettings(BaseSettings):
    uri: str = ""
    database: str = "gcode"
    collection: str = "students"

    class Config(BaseSettings.Config):
        env_prefix = "MONGO_"

mongo_settings = MongoSettings()
__all__ = ("mongo_settings")