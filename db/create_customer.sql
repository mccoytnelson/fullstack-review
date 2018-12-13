insert into customer (
    email, hash_value
)
values (
    $1,$2
)
returning *;