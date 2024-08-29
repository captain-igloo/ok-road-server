<?php

declare(strict_types=1);

namespace App\Form;

use Symfony\Component\Form\FormInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class JsonSerializer
{
    public function __construct(private CsrfTokenManagerInterface $csrfTokenManager)
    {
    }

    public function serialize(FormInterface $form): array
    {
        $serialized = [
            'fields' => [],
            'token' => $this->csrfTokenManager->getToken('registration_form')->getValue(),
        ];

        if (count($form->getErrors()) > 0) {
            $serialized['errors'] = [];
            foreach ($form->getErrors() as $e) {
                $serialized['errors'][] = $e->getMessage();
            }
        }
        
        foreach ($form as $k => $v) {
            $serialized['fields'][$k] = [
                'value' => $v->getData(),
            ];
            if (count($v->getErrors()) > 0) {
                $errors = [];
                foreach ($v->getErrors() as $e) {
                    $errors[] = $e->getMessage();
                }
                $serialized['fields'][$k]['errors'] = $errors;
            }
        }

        return $serialized;
    }
}
