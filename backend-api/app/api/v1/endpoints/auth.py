from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import (
    verify_password, get_password_hash, create_access_token,
    get_current_user_payload
)
from app.models.models import Usuario, Productor, Consumidor, Rol, Carrito
from app.schemas.schemas import UsuarioCreate, UsuarioLogin, Token, UsuarioResponse

router = APIRouter()

@router.post("/register", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UsuarioCreate, db: AsyncSession = Depends(get_db)):
    """RF-PRO-01 / RF-CON-01: Registro de nuevos usuarios con rol Productor o Consumidor"""
    correo_limpio = user_in.correo.strip().lower()
    stmt = select(Usuario).where(Usuario.correo == correo_limpio)
    result = await db.execute(stmt)
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico ya se encuentra registrado."
        )

    # Validar rol existente
    rol_stmt = select(Rol).where(Rol.id_rol == user_in.id_rol)
    rol_result = await db.execute(rol_stmt)
    rol = rol_result.scalars().first()
    if not rol:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El rol especificado no existe.")

    new_user = Usuario(
        id_rol=user_in.id_rol,
        nombre=user_in.nombre.strip(),
        apellidos=user_in.apellidos.strip(),
        correo=correo_limpio,
        contrasena_hash=get_password_hash(user_in.contrasena),
        telefono=user_in.telefono,
        activo=True
    )
    db.add(new_user)
    await db.flush()

    # Si es productor, crear su perfil inicial pendiente de validación
    if user_in.id_rol == 2:
        new_prod = Productor(
            id_usuario=new_user.id_usuario,
            nombre_negocio=f"{user_in.nombre.strip()} {user_in.apellidos.strip()}",
            municipio="Por definir",
            estado="Querétaro",
            estatus_validacion="pendiente"
        )
        db.add(new_prod)

    # Si es consumidor, crear su perfil y su carrito inicial
    elif user_in.id_rol == 3:
        new_cons = Consumidor(
            id_usuario=new_user.id_usuario,
            municipio="Querétaro"
        )
        db.add(new_cons)
        await db.flush()
        new_cart = Carrito(id_consumidor=new_cons.id_consumidor)
        db.add(new_cart)

    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(credentials: UsuarioLogin, db: AsyncSession = Depends(get_db)):
    """
    OBJ-API-02 / RF-ADM-01: Inicio de sesión mediante JSON con 'correo' y 'contrasena'.
    Utilizado por la app móvil React Native, panel Laravel y clientes REST.
    """
    correo_normalizado = credentials.correo.strip().lower()
    stmt = select(Usuario).where(Usuario.correo == correo_normalizado)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or not verify_password(credentials.contrasena, user.contrasena_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas (correo o contraseña no válidos)."
        )

    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La cuenta se encuentra inactiva. Contacte al administrador."
        )

    access_token = create_access_token(
        subject=str(user.id_usuario),
        role_id=user.id_rol
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        role_id=user.id_rol,
        user_id=user.id_usuario,
        name=f"{user.nombre} {user.apellidos}"
    )

@router.post("/token", response_model=Token)
async def login_oauth2(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint compatible con OAuth2 Password Flow.
    Utilizado directamente por el botón 'Authorize' de Swagger UI (/docs).
    """
    correo_normalizado = form_data.username.strip().lower()
    stmt = select(Usuario).where(Usuario.correo == correo_normalizado)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.contrasena_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas (correo o contraseña no válidos)."
        )

    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La cuenta se encuentra inactiva. Contacte al administrador."
        )

    access_token = create_access_token(
        subject=str(user.id_usuario),
        role_id=user.id_rol
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        role_id=user.id_rol,
        user_id=user.id_usuario,
        name=f"{user.nombre} {user.apellidos}"
    )

@router.get("/me", response_model=UsuarioResponse)
async def get_me(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    """Consulta los datos del usuario en sesión actual"""
    user_id = int(payload.get("sub"))
    stmt = select(Usuario).where(Usuario.id_usuario == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    return user
