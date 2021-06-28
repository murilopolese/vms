(define grid
  (list
    (vector->list (make-vector 8 -1))
    (vector->list (make-vector 8 -1))
    (vector->list (make-vector 8 -1))
    (vector->list (make-vector 8 -1))
    (vector->list (make-vector 8 -1))
    (vector->list (make-vector 8 -1))
    (vector->list (make-vector 8 -1))
    (vector->list (make-vector 8 -1))
  )

)
(define rules
  '( ; Rules
    ( ; TICK RULES
      ( ; RULE 0
        ( ; WHEN
          ( n n n )
          ( n 3 n )
          ( n n n )
        )
        ( ; THEN
          ( n n n )
          ( n 2 n )
          ( n n n )
        )
      )
      ( ; RULE 1
        ( ; WHEN
          ( n n n )
          ( n 2 n )
          ( n n n )
        )
        ( ; THEN
          ( n n n )
          ( n 1 n )
          ( n n n )
        )
      )
      ( ; RULE 2
        ( ; WHEN (test do nothing)
          ( n n n )
          ( n 1 n )
          ( n n n )
        )
        ( ; THEN
          ( n n n )
          ( n 0 n )
          ( n n n )
        )
      )
      ( ; RULE 3
        ( ; WHEN (test do nothing)
          ( n 3 n )
          ( n 0 n )
          ( n n n )
        )
        ( ; THEN
          ( n n n )
          ( n 3 n )
          ( n n n )
        )
      )
      ( ; RULE 4
        ( ; WHEN (test do nothing)
          ( n n n )
          ( n 0 3 )
          ( n n n )
        )
        ( ; THEN
          ( n n n )
          ( n 3 n )
          ( n n n )
        )
      )
      ( ; RULE 5
        ( ; WHEN (test do nothing)
          ( n n n )
          ( n 0 n )
          ( n 3 n )
        )
        ( ; THEN
          ( n n n )
          ( n 3 n )
          ( n n n )
        )
      )
      ( ; RULE 6
        ( ; WHEN (test do nothing)
          ( n n n )
          ( 3 0 n )
          ( n n n )
        )
        ( ; THEN
          ( n n n )
          ( n 3 n )
          ( n n n )
        )
      )
    )
  )
)

; Python's range
(define range
  (lambda (n m)
    (cond
      ((= n m) (list n))
      (else (cons n (range ((if (< n m) + -) n 1) m)))
    )
  )
)

; Get nth item from list
(define nth
  (lambda (lst k)
    (list-ref lst k)
  )
)

; Get item from 2d list
(define nth-2d
  (lambda (lst x y)
    (nth (nth lst y) x)
  )
)

; Set nth item on list
(define set-nth
  (lambda (lst k val)
    (set-car! (list-tail lst k) val)
  )
)

; Set nth item on 2d list
(define set-nth-2d
  (lambda (lst x y val)
    (set-car! (list-tail (nth lst y) x) val)
  )
)

; Iterator like javascript's map
(define iterate
  (lambda (array function)
    (map function array (range 0 (length array)))
  )
)

(define (match rule grid x y)
  (define when (nth rule 0))
  (if (eq? (nth-2d when 1 1) 'n)
    0 ; Skip rule if center of when is n
    (begin
      ; Check if the center of when is the grid cell
      (if (= (nth-2d when 1 1) (nth-2d grid x y))
        (begin
          (define matched 1)
          (iterate when
            (lambda (row _y)
              (iterate row
                (lambda (value _x)
                  (if (not (eq? value 'n))
                    (if (not (eq?
                        value
                        (nth-2d
                          grid
                          (- (+ _x x) 1)
                          (- (+ _y y) 1)
                        )
                      ))
                      (define matched 0)
                    )
                  )
                )
              )
            )
          )
          matched
        )
        0
      )
    )
  )
)

(define (apply rule grid x y)
  (define then (nth rule 1))
  (iterate then
    (lambda (row _y)
      (iterate row
        (lambda (value _x)
          (if (not (eq? value 'n))
            (set-nth-2d
              grid
              (max 0 (min 7 (- (+ x _x) 1)))
              (max 0 (min 7 (- (+ y _y) 1)))
              value
            )
          )
        )
      )
    )
  )
)

(define (render grid)
  (iterate grid
    (lambda (row y)
      (print
        (iterate row
          (lambda (value x)
            (if (eq? value -1)
              '_
              value
            )
          )
        )
      )
    )
  )
  (print '========)
)

(define (tick)
  (print 'before)
  (render grid)
  ; Create temporary grid
  (define tempGrid (list-copy grid))
  ; Iterate rows
  (iterate grid
    (lambda (row y)
      (iterate row
        (lambda (value x)
          (iterate (nth rules 0)
            (lambda (rule i)
              (if (eq? 1 (match rule grid x y))
                (apply rule tempGrid x y)
              )
            )
          )
        )
      )
    )
  )
  ; Swap grids
  (set! grid tempGrid)
  (print 'after)
  (render grid)
)

(set-nth (nth grid 2) 2 3)
(set-nth (nth grid 2) 3 2)


(set-nth (nth grid 3) 2 0)
(set-nth (nth grid 4) 2 0)
(set-nth (nth grid 5) 2 0)

(set-nth (nth grid 2) 4 0)
(set-nth (nth grid 3) 4 0)
(set-nth (nth grid 4) 4 0)
(set-nth (nth grid 5) 4 0)

(set-nth (nth grid 5) 3 0)

(print '(tick))
(tick)
