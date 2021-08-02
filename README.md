# checkout-api

## Requisitos

- [Docker](https://docs.docker.com/);
- [Docker Compose](https://docs.docker.com/compose/).

## Executando os testes automatizados

```sh
$ make test
```

## Subindo localmente o servidor http

servidor acessado pela porta `8000`

```sh
$ make up
```

## Endpoints

<details><summary>GET /_health_check</summary>
<p>

status code: 200
```
ok
```

</p>
</details>

<br>

<details><summary>POST /checkout</summary>
<p>

Payload esperado:

```json
{
  "products": [
    {
      "id": 1,
      "quantity": 1
    }
  ]
}
```

Resposta:

status code: 200
```json
{
  "total_amount": 15157,
  "total_amount_with_discount": 14399.15,
  "total_discount": 757.85,
  "products": [
    {
      "id": 1,
      "quantity": 1,
      "unit_amount": 15157,
      "total_amount": 15157,
      "discount": 757.85,
      "is_gift": false
    },
    {
      "id": 6,
      "quantity": 1,
      "unit_amount": 0,
      "total_amount": 0,
      "discount": 0,
      "is_gift": true
    }
  ]
}
```

</p>
</details>
